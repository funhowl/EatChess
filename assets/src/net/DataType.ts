export class C2Slogin {
    code: string
    Key = MsgType.C2Slogin;
}

export class S2Clogin {
    Key = MsgType.S2Clogin;
    Sucess: boolean
    Data: any
    Now: any
}

export class C2Sroomessage {
    Key = MsgType.C2Sroomessage;
}

export class S2Croomessage {
    Key = MsgType.S2Croomessage;
    Data: any
}

export class C2Sjoinroom {
    Roomid: number
    Key = MsgType.C2Sjoinroom;
}

export class S2Cgamemsg {
    GameMsg: any
    Key = MsgType.S2Cgamemsg;
}

export class C2Sgamechange {
    Start: number
    Move: number
    Key = MsgType.C2Sgamechange;
}

export class S2Cgamewin {
    Win: string // 赢的人的accid
    Key = MsgType.S2Cgamewin;
}

export enum MsgType {
    C2Slogin = 1000,
    S2Clogin = 1001,

    C2Sroomessage = 1002,// 房间信息请求
    S2Croomessage = 1003,

    C2Sjoinroom = 1004, // 加入房间请求
	S2Cjoinroom = 1005,

    C2Sgamemsg = 1008, // 游戏信息请求
	S2Cgamemsg = 1009, // 游戏信息返回

    C2Sgamechange = 1006, // 游戏棋子移动请求

    S2Cgamewin = 1011, // 游戏胜利通知
}

export enum ResultType {

}