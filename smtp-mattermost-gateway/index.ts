import { SMTPServer } from 'smtp-server';
import * as mailparser from 'mailparser';
import axios from 'axios';
import { createCache } from 'cache-manager';

const mattermostUrl = process.env.MATTERMOST_URL;

const mattermostBotUserCache = createCache({ ttl: 60 * 1000 /* ms */});

const mattermostUsersCache = createCache({ ttl: 60 * 60 * 1000 /* ms */});

type MattermostUser = {
    email: string;
    user_id: string;
    username: string;
};

const sessionCache = createCache({ ttl: 60 * 1000 /* ms */});

type SessionData = {
    user: string;
    password: string;
};

const server = new SMTPServer({

    disabledCommands: ['STARTTLS'],

    onAuth(auth, session, callback) {
        const invalidError = new Error('Invalid username or password');
        if (auth.username !== "" && auth.password !== "") {
            const sessionData: SessionData = { user: auth.username, password: auth.password };
            fetcCachedMattermostMe(sessionData).then(me => (async () => {
                if (me) {
                    if (auth.username == me.username) {
                        await sessionCache.set<SessionData>(session.id, sessionData);
                        callback(null, { user: auth.username });
                    } else {
                        throw invalidError;
                    }
                } else {
                    throw invalidError;
                }
            })()).catch(err => {
                callback(err);
            });
        } else {
            callback(invalidError);
        }
    },

    onData(stream, session, callback) {
        Promise.all([mailparser.simpleParser(stream), sessionCache.get<SessionData>(session.id)])
            .then(resolved => (async () =>{
                const [parsed, sessionData] = resolved;

                if (!sessionData) {
                    console.error('Session data not found');
                    return;
                }

                const me = await fetcCachedMattermostMe(sessionData);
                if (!me) {
                    console.warn('Bot user not found');
                    return;
                }

                const recipients =
                    (parsed.to ? parsed.to instanceof Array ? parsed.to : [parsed.to] : [])
                        .map(r => r.text);
                const author = parsed.from?.text ? parsed.from.text : '';
                const title = parsed.subject ? parsed.subject : '';
                const message = parsed.text;
                if (!message) {
                    console.warn('Empty message');
                    return;
                }

                recipients.forEach(recipient => (async () => {
                    const user = await
                        mattermostUsersCache.get<MattermostUser>(recipient).then(user => {
                            if (user) {
                                return user;
                            } else {
                                console.log(`User not found in cache for email: ${recipient}`);
                                return fetchMattermostUsers(sessionData).then(users =>
                                    mattermostUsersCache.mset<MattermostUser>(users.map(user => ({ key: user.email, value: user })))
                                )
                                .then(() => mattermostUsersCache.get<MattermostUser>(recipient));
                            }
                        });

                    if (!user) {
                        console.warn(`User not found for email: ${recipient}`);
                        return;
                    }

                    console.log(`Post direct message to Mattermost user: [${user.email}] ${title}`);

                    await postMattermostDM(sessionData, author, me, user, title, message);
                })());
            })())
            .catch(err => {
                console.error('Error parsing email:', err);
            })
            .finally(() => {
                sessionCache.del(session.id);
                callback();
            });
    },
});

server.listen(2525, () => {
  console.log('SMTP server is listening on port 2525');
  console.log(`Mattermost URL: ${mattermostUrl}`);
});

// https://api.mattermost.com/

async function fetcCachedMattermostMe(session: SessionData): Promise<MattermostUser | void> {
    return mattermostBotUserCache.wrap(session.password, () => fetcMattermostMe(session));
}

async function fetcMattermostMe(session: SessionData): Promise<MattermostUser | void> {
    return axios.get(`${mattermostUrl}/api/v4/users/me`, {
        headers: {
            Authorization: `Bearer ${session.password}`
        },
    })
    .then(response => {
        const user = response.data;
        return { email: user.email, user_id: user.id, username: user.username };
    })
    .catch(error => {
        console.error('Error calling Mattermost API:', error);
    });
}

async function fetchMattermostUsers(session: SessionData, page: number = 0): Promise<MattermostUser[]> {
    const per_page = 50;
    return axios.get(`${mattermostUrl}/api/v4/users?page=${page}&per_page=${per_page}`, {
        headers: {
            Authorization: `Bearer ${session.password}`
        }
    })
    .catch(error => {
        console.error('Error calling Mattermost API:', error);
    })
    .then(response => {
        if (response) {
            const users: any[] = response.data;
            const mUsers: MattermostUser[] = users.map(user => ({ email: user.email, user_id: user.id, username: user.username }));
            if (mUsers.length === per_page) {
                return fetchMattermostUsers(session, page + 1).then(nextUsers => mUsers.concat(nextUsers));
            } else {
                return mUsers;
            }
        } else {
            return [];
        }
    });
}

async function postMattermostDM(session: SessionData, author: string, from: MattermostUser, to: MattermostUser, title: string, message: string): Promise<void> {
    const channel = await axios.post(`${mattermostUrl}/api/v4/channels/direct`, [ from.user_id, to.user_id], {
                headers: {
                    Authorization: `Bearer ${session.password}`
                }
            }
        );
    await axios.post(`${mattermostUrl}/api/v4/posts`, {
            channel_id: channel.data.id,
            props: {
                attachments: [{
                    author_name: author,
                    title: title,
                    text: message,
                }]
            },
    },{
        headers: {
            'Authorization': `Bearer ${session.password}`
        }
    })
    .catch(error => {
        console.error('Error calling Mattermost API:', error);
    });
}
