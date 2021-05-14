import { NetMgr } from "./NetMgr";
export class ClientSocket {
    
    private static _instance: ClientSocket;
    public static get instance(): ClientSocket {
		if (this._instance == null) {
			this._instance = new ClientSocket();
			window["ClientSocket"] = this;
		}
		return this._instance;
	}
    public socketTask: WebSocket;
	public gameState: number;  //游戏状态 1代表登录  2代表大厅  3代表游戏
    
    /** 
	* 初始化Socket
	*/
	public initSocket(): void {
        if (this.socketTask) this.socketTask.close();
        let wsUri ="ws://192.168.0.67:7777/ws"; 
        this.socketTask = new WebSocket(wsUri);
        this.socketTask.onopen = this.onSocketOpen.bind(this);
        this.socketTask.onmessage = this.onSocketMessage.bind(this);
        this.socketTask.onerror = this.onSocketError.bind(this);
        this.socketTask.onclose = this.onSocketClose.bind(this);		
    }

    public onSocketOpen(event: any): void {
        console.log("onSocketOpen")
    }
    
    public onSocketMessage(res: any): void {
        console.log("onSocketMessage")
        NetMgr.manageServerMessage(res?.data);
    }

    public onSocketError(res: any): void {
        console.log("onSocketError")
    }

    public onSocketClose(res: any): void {
        console.log("onSocketClose")
    }

    public sendSocketMessage(msg: string | ArrayBuffer): void {
		//let readyState: number = Laya.Browser.onMiniGame ? GameWebSocket.instance.socketTask.readyState : GameWebSocket.instance.socketTask._socket.readyState;
		if (this.socketTask.readyState === WebSocket.OPEN) {
			// if (Laya.Browser.onMiniGame) {
			// 	this.socketTask.send({
			// 		data: msg,
			// 		success: function (res) {
			// 			// console.log("发送数据:", res)
			// 		},
			// 		fail: function (res) {
			// 			if (GameUtils.log) console.log("发送数据失败，请检查网络", res)
			// 		}
			// 	})
			// } else {
			this.socketTask.send(msg);
			// }
		} else {
			this.onSocketClose(null);
		}
	}

}