import Context from '../utils/Context';
import ISession from '../interfaces/ISession';
import { v1 as uuidV1 } from 'uuid';

export default class SessionService {
	private context: Context;
	private sessions: Map<string, ISession>;

	public constructor(context: Context) {
		this.context = context;
		this.sessions = new Map<string, ISession>();
	}

	public createSession(dmId: string, mapId: string): ISession {
		const newSession: ISession = {
			discriminator: 'spectrum.session',
			id: uuidV1(),
			dm: dmId,
			map: mapId,
			players: [],
			spectators: [],
			playerCode: this.generateAlphaNumericCode(4), // TODO Check this against all other sessions to verify uniqueness
			spectatorCode: this.generateAlphaNumericCode(4), // TODO Same as playercode
			dateCreated: Date.now(),
		};
		this.sessions.set(newSession.id, newSession);
		return newSession;
	}

	public joinSession(
		userId: string,
		playerCode: string
	): ISession | undefined {
		for (let s of this.sessions.values()) {
			if (s.playerCode === playerCode) {
				s.players.push(userId);
				return s;
			}
		}
		return undefined;
	}

	public requestSession(sessionId: string): ISession | undefined {
		return this.sessions.get(sessionId);
	}

	public updateSession(session: ISession): void {
		this.sessions.set(session.id, session);
	}

	private generateAlphaNumericCode(n: number): string {
		const lb = Math.pow(36, n - 1);
		const ub = Math.pow(36, n) - 1;
		const rn = Math.floor(Math.random() * (ub - lb) + lb);
		return rn.toString(36);
	}
}
