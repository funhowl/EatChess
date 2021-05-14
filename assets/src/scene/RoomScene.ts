import { GameEvent } from "../net/GameEvent";
import { ClientSocket } from "../net/ClientSocket";
import { NetMgr } from "../net/NetMgr";
import { S2Cgamemsg, C2Sjoinroom,C2Sroomessage,S2Croomessage,MsgType } from "../net/DataType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RoomScene extends cc.Component {

    @property({ type: cc.Node, tooltip: '房间框' })
    btn_room: cc.Node = null;
    @property({ type: cc.Label, tooltip: '房间信息' })
    msg_room: cc.Label = null;

    //定义预制体属性，在界面中将建立好的prefab拖拽过来
    @property(cc.Prefab)
    gamePrefab:cc.Prefab = null

    onLoad () {
        ClientSocket.instance.gameState = 2
        GameEvent.on(MsgType.S2Croomessage, this.S2Croomessage, this);
        GameEvent.on(MsgType.S2Cgamemsg, this.S2Cgamemsg, this);
        this.init()
    }

    init () {
        let c: C2Sroomessage = new C2Sroomessage();
            c.Key = MsgType.C2Sroomessage;
            NetMgr.sendRequest(c);
    }

    public S2Croomessage(msg: S2Croomessage): void {
        if(ClientSocket.instance.gameState != 2)return
        let data = msg.Data
        let x = -300 // 300 
        let y = 200 // 200 
       
        for(let k in data){
           
            let bg = cc.instantiate(this.btn_room)
            bg.active = true;
            this.node.addChild(bg)
            
            bg.x = x
            bg.y = y
          
            let str = "房间号 " + data[k].Roomid + "\n玩家 " + (data[k].Left ? data[k].Left : "无") + "\n玩家 " + (data[k].Right? data[k].Right : "无")
            bg.getChildByName('msg').getComponent(cc.Label).string = str;
            bg.on(cc.Node.EventType.TOUCH_END, this.onEnterBtnClick.bind(this, data[k].Roomid), this);

            if(x == 300){
                y-= 200
                x = -300
            }else
                x+=300
        }
    }

    private onEnterBtnClick(roomid){
        if(ClientSocket.instance.gameState != 2)return
        console.log("Roomid:", roomid)
        let c: C2Sjoinroom = new C2Sjoinroom();
            c.Key = MsgType.C2Sjoinroom;
            c.Roomid = roomid
            NetMgr.sendRequest(c);
    }

    public S2Cgamemsg(msg: S2Cgamemsg): void {
        
        if(ClientSocket.instance.gameState != 2)return
        let gamePrefab = cc.instantiate(this.gamePrefab);
        this.node.addChild(gamePrefab)
        gamePrefab.x = 0
        gamePrefab.y = 0
        GameEvent.emit(msg.Key, msg); 
    }
}
