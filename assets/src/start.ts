// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    loginPrefab:cc.Prefab = null

    start () {
        let loginPrefab = cc.instantiate(this.loginPrefab);
        this.node.addChild(loginPrefab)
        loginPrefab.x = 0
        loginPrefab.y = 0
        loginPrefab.width = cc.winSize.width * 2;
        loginPrefab.height = cc.winSize.height * 2;
    }

    // update (dt) {}
}
