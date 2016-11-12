
module.exports = class FramelessWindowUtils {
  constructor(win) {
    this._win = win;
    this._registeredInteractableElements = [];
  }

  registerInteractableElement(element) {
    this._registeredInteractableElements.push({
      element: element,
      mouseEventsIgnored: true
    });
  }

  getRegisteredInteractableElements() {
    return this._registeredInteractableElements;
  }

  _isPointInRect(point, rect) {
    // console.log(`Comparing (${point.x}, ${point.y})  (${rect.left}, ${rect.top}, ${rect.right}, ${rect.bottom})`);
    if(point.x >= rect.left && point.y >= rect.top
      && point.y <= rect.bottom && point.x <= rect.right){
      return true;
    }
    return false;
  };

  checkInteractableElements(mousePos) {
    let list = this.getRegisteredInteractableElements();
    for(let i = 0; i < list.length; i++){
      // let inputPos_t = inputContainer.getBoundingClientRect();
      let item = list[i];
      let elem = item.element;
      let pos = elem.getBoundingClientRect();
      // console.log('Element');
      // console.log(elem);
      // console.log(pos);

      let winPos = this._win.getPosition();

      let inputBounds = elem.getBoundingClientRect();
      let newRect = {
        top: inputBounds.top + winPos[1],
        right: inputBounds.right + winPos[0],
        bottom: inputBounds.bottom + winPos[1],
        left: inputBounds.left + winPos[0]
      };
      // console.log(newRect);
      if(this._isPointInRect(mousePos, newRect) === true){
        // console.log('Is over');
        if(item.mouseEventsIgnored === true){
          this._win.setIgnoreMouseEvents(false);
        }
        item.mouseEventsIgnored = false;
      }else{
        if(item.mouseEventsIgnored === false){
          this._win.setIgnoreMouseEvents(true);
        }
        item.mouseEventsIgnored = true;
      }
    }
    // console.log('');

  }




}
