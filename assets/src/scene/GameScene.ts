import { GameEvent } from "../net/GameEvent";
import { ClientSocket } from "../net/ClientSocket";
import { UserMgr } from "../net/UserMgr";
import { NetMgr } from "../net/NetMgr";

import { S2Cgamewin, C2Sgamechange, S2Cgamemsg, MsgType } from "../net/DataType";

const {ccclass, property} = cc._decorator;
let bgArr: cc.Node[] = []; 
let anticipationArr: number[] = []; //亮格子的数组
let chessArr: number[] = []
let lastchoose: number = 0 // 上一次点击的棋子
let ismyTrun: boolean // 是不是我的回合

@ccclass
export default class GameScene extends cc.Component {
    @property({ type: cc.Node, tooltip: '棋子' })
    piece: cc.Node = null;

    @property({ type: cc.Label, tooltip: '回合' })
    round: cc.Label = null;

    onLoad () {
        ClientSocket.instance.gameState = 3
        GameEvent.on(MsgType.S2Cgamemsg, this.S2Cgamemsg, this);
        GameEvent.on(MsgType.S2Cgamewin, this.S2Cgamewin, this);
    }

    public S2Cgamewin(msg: S2Cgamewin): void {
        this.round.string = msg.Win == UserMgr.instance.accid ? "赢了": "输了"
    }

    public S2Cgamemsg(msg: S2Cgamemsg): void {

        console.log("----------------------- in S2Cgamemsg:", UserMgr.instance.accid)
        let gamemsg = msg.GameMsg
        let chess: number[] = chessArr = gamemsg.Chess
        ismyTrun = gamemsg.Trun == 0
        if(UserMgr.instance.accid == gamemsg.Right) ismyTrun = !ismyTrun
       
        this.round.string = ismyTrun ? "我方回合": "敌方回合"

        let x = -330 // 300 
        let y = 240 // 200 
        for(let i= 0; i < chess.length; i++){
           
            let bg = cc.instantiate(this.piece)
            bgArr[i] = bg
            bg.active = true;
            this.node.addChild(bg)
            bg.x = x
            bg.y = y
 
            if(this.checkByChessid(i) == 1){ // 水
                bg.color = cc.Color.BLUE
            }else if(this.checkByChessid(i) == 2){ 
                bg.color = cc.Color.YELLOW
            }else if(this.checkByChessid(i) == 3){
                bg.color = cc.Color.BLACK
            }else
                bg.color = cc.Color.GREEN
               
            let value = chess[i]
            if(value % 100 > 0){
                bg.getChildByName('msg').getComponent(cc.Label).string = this.getStrByValue(value % 10); 
                let bool:boolean = value%100 > 10
                if(UserMgr.instance.accid == gamemsg.Left) bool= !bool
                bg.getChildByName('sign').getComponent(cc.Label).string = bool ? "我": "敌";
            }else{
                bg.getChildByName('sign').getComponent(cc.Label).string = ""
                bg.getChildByName('msg').getComponent(cc.Label).string = ""
            }

            bg.on(cc.Node.EventType.TOUCH_END, this.onEnterBtnClick.bind(this, i), this);

            if(i % 9 == 8){
                y-= 80
                x = -330
            }else
                x+=80
        }
    }
    private getStrByValue(value: number){
        return ["",
            " ",
            "鼠",
            "猫",
            "狗",
            "狼",
            "豹",
            "虎",
            "狮",
            "象",
        ][value];
    }

    // private onStartBtnClick(chessid){
    //     console.log("onStartBtnClick:", chessid)
    //     if(ClientSocket.instance.gameState != 3)return
        
    // }
    private onEnterBtnClick(chessid: number){
        console.log("onEnterBtnClick:", chessid)
        if(ClientSocket.instance.gameState != 3)return
        if(!ismyTrun) return
      
        let get = 0
        for(let i = 0; i < 4; i++){ // 不管点哪里 都要关了提示位置
            if(!get && anticipationArr[i] == chessid){
                get = i + 1
            }
            let bg = bgArr[anticipationArr[i]]
            if(bg)bg.getChildByName('anticipation').active = false     
        }
        if(get){
            let c: C2Sgamechange = new C2Sgamechange();
            c.Key = MsgType.C2Sgamechange;
            c.Start = lastchoose
            c.Move = get
            NetMgr.sendRequest(c);
            anticipationArr.length = 0
            lastchoose = 0
            return
        }

        let value = chessArr[chessid]

        if(value % 100 == 0) return // 没有棋子
        lastchoose = chessid
        let arr = []
        if(chessid % 9 == 8){
            arr.push(-1)
        }else{
            arr.push(this.findEndofMove(chessid, 1))
        }
        if(chessid % 9 == 0){
            arr.push(-1)
        }else{
            arr.push(this.findEndofMove(chessid, -1))
        }
        if(chessid < 9){
            arr.push(-1)
        }else{
            arr.push(this.findEndofMove(chessid, -9))
        }
        if(chessid > 53){
            arr.push(-1)
        }else{
            arr.push(this.findEndofMove(chessid, 9))
        }
        
        this.closeAnticipationArr(arr)
    }

    private findEndofMove(chessid: number, up: number) :number{
        let end = chessid + up
        let value = this.getValueByChessid(chessid)

        if(this.checkByChessid(end) == 1){ // 水
            if(value == 2)  return end  // 老鼠可以进水
            if(value == 7 || value == 8){// 狮虎可以跳水但前提是水里没老鼠
                for(let i = 1 ; i < 5; i++){
                    end = chessid + up * i
                    if(this.checkByChessid(end) == 1){
                        if(this.getValueByChessid(end) != 0){
                            return -1
                        }
                    }else{
                        break
                    }
                }
            }else{
                return -1
            }
        }
        if((end == 27 || end == 35) && (value != 1)) {
            return -1
        }

        return end
    }

    private closeAnticipationArr(arr: number[]){
       
        anticipationArr.length = 0
        for(let i = 0; i < 4; i++){
            anticipationArr.push(arr[i])
            let bg = bgArr[arr[i]]
            if(bg)bg.getChildByName('anticipation').active = true     
        }
    }

    private getValueByChessid(chessid: number):number{

        //在对方兽穴中战斗力为1
        if(chessid == 18|| chessid == 28 || chessid == 36){//左边兽穴
            if(chessArr[chessid]%100 > 10){
                return 1
            }
        }
        if(chessid == 26 || chessid == 34 || chessid == 44){//右边边兽穴
            if(chessArr[chessid]%100 < 10){
                return 1
            }
        }
        let value = chessArr[chessid]
        return value % 10
    }

    private checkByChessid(chessid: number):number{// 0是陆地  1是水 2是陷阱 3是兽穴
        return ~~(chessArr[chessid] / 100) // 0是陆地  1是水 2是陷阱 3是兽穴
    }
    
}
