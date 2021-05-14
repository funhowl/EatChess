import { GameEvent } from "./GameEvent";
import { MsgType } from "./DataType";
import { ClientSocket } from "./ClientSocket";
 /**
 * 网络交互处理
 */
export class NetMgr {
    
    /**
	 * 处理服务器请求结果
	 */
	public static manageServerMessage(res: any) {
		let msgs = JSON.parse(res);
		if (msgs instanceof Array) {
			for (var i = 0; i < msgs.length; i++) {
				let msg = msgs[i]
				console.log("收到：", MsgType[msg.Key], msg)
				GameEvent.emit(msg.Key, msg);
			}
		}
		else {
			let typename = MsgType[msgs.Key]
			if (!typename) {
				return console.log("err msg ", msgs)
			}
			console.log("收到：", MsgType[msgs.Key], msgs)
			GameEvent.emit(msgs.Key, msgs); 
		}
	}
    public static sendRequest(msg) {
		console.log("发送：", msg)
		ClientSocket.instance.sendSocketMessage(JSON.stringify(msg));
	}
}