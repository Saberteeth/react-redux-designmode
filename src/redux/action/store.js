import { Active } from "../../utils/Rxjs/Active";
import { createAction } from "../../utils/R2/R2Factory";
import Rx from "rxjs";

const Database = {
  data:'<h1>Readme</h1><p>This is a demo about <strong>RichEditor</strong>. U can try everything.<em>There have some feature about it:</em></p><ul><li>Ugly</li><li>Bad icons</li><li>A little Utils</li></ul><p><em><strong>Package:</strong></em></p><ol><li><em>React</em></li><li><em>draft-js</em></li><li><em>draft-js-export-html</em></li></ol><p><em><strong>This is code:</strong></em></p><pre><code><em>import React from "react";</em><br><em>import RichEditor from "./index";</em><br><em>const value = "..."</em><br><em>const onChange = html =&gt; console.log(html);</em><br><em>export default () =&gt; &lt;RichEditor value={value} onChange={onChange} /&gt;</em></code></pre><blockquote><em>https://draftjs.org/</em></blockquote><blockquote><em>http://www.react.org/</em></blockquote><blockquote><em>https://www.npmjs.com/package/draft-js-export-html</em></blockquote>',
  updataFlag: new Date().getTime()
}

export default  class Type {
  static get TYPE() {
    return "STORE";
  }

  static get LOAD_README() {
    return "LOAD_README";
  }

  static get ERROR_README() {
    return "ERROR_README";
  }

  static get SUCCESS_README() {
    return "SUCCESS_README";
  }
}

function loadData(dispatch) {
  setTimeout(function() {
    try {
      load.updataFlag = Database.updataFlag;
      loadResert.next({ type: 0, data: Database.data, dispatch });
    } catch (err) {
      loadResert.next({ type: 1, dispatch });
    }
  }, 2000);
}
const loadBegin = new Active(subject => {
  subject.delay(200).subscribe(dispatch => {
    if (!load.isLoading) return;
    dispatch(createAction({ who: Type.TYPE, active: Type.LOAD_README }));
  });
});
const loadResert = new Active(subject => {
  subject.subscribe(e => {
    load.isLoading = false;
    switch (e.type) {
      case 0:
        e.dispatch(
          createAction({ who: Type.TYPE, active: Type.SUCCESS_README }, e.data)
        );
        break;
      case 1:
        e.dispatch(createAction({ who: Type.TYPE, active: Type.ERROR_README }));
        break;
      default:
    }
  });
});
const load = new Active(subject => {
  subject.throttleTime(3000).subscribe(dispatch => {
    console.log("load readme");
    if(Database.updataFlag == load.updataFlag) return;

    load.isLoading = true;
    loadBegin.subject.next(dispatch);
    loadData(dispatch);
  });
});
export function loadReadme() {
  return dispatch => {
    load.next(dispatch);
  };
}
const save = new Active(subject => {
  subject.throttleTime(3000).subscribe(readme=>{
    console.log("updata readme.");
    Database.data = readme;
    Database.updataFlag = new Date().getTime();    
  })
})
export function saveReadme(readme){
  return dispatch => {
    save.subject.next(readme);
  }
}
