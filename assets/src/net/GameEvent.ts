export class GameEvent {

    /******************** 基础方法 ********************/

    /** MsgType对应数值类型事件 */
    static event: cc.EventTarget = new cc.EventTarget()

    static init() {
        window["GameEvent"] = this;
    }

    /**
     * 注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
     * @param type 
     * @param callback 
     * @param target 
     * @param useCapture 
     */
    static on<T extends Function>(type: number | string, callback: T, target?: any, useCapture?: boolean): T {
        return this.event.on(type + '', callback, target, useCapture);
    }

    /**
     * 删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
     * @param type 
     * @param callback 
     * @param target 
     */
    static off(type: number | string, callback?: Function, target?: any): void {
        return this.event.off(type + '', callback, target);
    }

    /**
     * 通过事件名发送自定义事件
     * @param key 
     */
    static emit(key: number | string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        return this.event.emit(key + '', arg1, arg2, arg3, arg4, arg5);
    }
}