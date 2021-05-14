import { ClientSocket } from "../net/ClientSocket";
import { UserMgr } from "../net/UserMgr";
import { GameEvent } from "../net/GameEvent";
import { NetMgr } from "../net/NetMgr";
import { S2Cgamemsg,S2Clogin,C2Slogin,MsgType } from "../net/DataType";
const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component {

    @property({ type: cc.Node, tooltip: '开始按钮' })
    btn_start: cc.Node = null;
    @property({ type: cc.EditBox, tooltip: '输入框' })
    input_code: cc.EditBox = null;

    //定义预制体属性，在界面中将建立好的prefab拖拽过来
    @property(cc.Prefab)
    roomPrefab:cc.Prefab = null

    /**WebSocket对象 */
	public socketTask: WebSocket;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ClientSocket.instance.gameState = 1
        this.btn_start.on(cc.Node.EventType.TOUCH_END, this.onEnterBtnClick, this);
        if(!ClientSocket.instance.socketTask){
            ClientSocket.instance.initSocket()
        }
        GameEvent.on(MsgType.S2Clogin, this.s_login_game, this);
    }

    private onEnterBtnClick(){

        if(ClientSocket.instance.gameState != 1)return
        let code = this.input_code.string;
        if (!code || isNaN(+code)) return;
        if(!ClientSocket.instance.socketTask){
            ClientSocket.instance.initSocket()
        }else{
            let c: C2Slogin = new C2Slogin();
            c.Key = MsgType.C2Slogin
            c.code = code
            NetMgr.sendRequest(c);
        }
    }

    public s_login_game(msg: S2Clogin): void {
       
        if(ClientSocket.instance.gameState != 1)return
        if(msg.Sucess){
            UserMgr.instance.accid = msg.Data.Accid
            let roomPrefab = cc.instantiate(this.roomPrefab);
            this.node.addChild(roomPrefab)
            roomPrefab.x = 0
            roomPrefab.y = 0
            if(msg.Data.GameMsg && msg.Data.GameMsg.Left && msg.Data.GameMsg.Right){
                let c: S2Cgamemsg = new S2Cgamemsg();
                c.Key = MsgType.S2Cgamemsg
                c.GameMsg = msg.Data.GameMsg
                GameEvent.emit(MsgType.S2Cgamemsg, c);              
            }
        }
    }

    // update (dt) {}
}
