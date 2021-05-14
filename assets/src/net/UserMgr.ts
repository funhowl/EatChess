export class UserMgr {
    private static _instance: UserMgr;
	public static get instance(): UserMgr {
		if (UserMgr._instance == null) {
			UserMgr._instance = new UserMgr();
			window['UserMgr'] = this;
		}
		return UserMgr._instance;
	}

    /**昵称 */
	public accid: string = "";
}