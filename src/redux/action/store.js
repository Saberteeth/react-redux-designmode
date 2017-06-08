import { Active } from "../../utils/Rxjs/Active";
import { createAction } from "../../utils/R2/R2Factory";
import Rx from "rxjs";

const Database = {
  data: "<h2>Readme</h2><p>This is a demo about react&amp;redux design mode. Hope that can help u creating a better project. There have a lot of utils u can use in your project.</p><p><strong>Util list:</strong></p><ul><li>R2</li><li>RichEditor</li><li>Rxjs</li><li>VCon</li></ul><p>There have a demo about VCon. That's a svg utils that can help u use svg image.</p><p>e.g.</p><pre><code>import VCon from '..';</code></pre><pre><code>const { Setting } = VCon;</code></pre><pre><code>const DemoView = props =&gt; &lt;Setting /&gt;;&nbsp;</code></pre><p><strong>Github:</strong></p><blockquote>https://github.com/Saberteeth/react-redux-designmode</blockquote>",
  updataFlag: new Date().getTime()
};

export default class Type {
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
    if (Database.updataFlag == load.updataFlag) return;

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
  subject.throttleTime(3000).subscribe(readme => {
    console.log("updata readme.");
    Database.data = readme;
    Database.updataFlag = new Date().getTime();
  });
});
export function saveReadme(readme) {
  return dispatch => {
    save.subject.next(readme);
  };
}

