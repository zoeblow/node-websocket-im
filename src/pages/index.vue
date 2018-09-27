<template>
  <div class="index">
    <fe-header>WebSocket群聊</fe-header>
    <div class="box">
      <ul id="chatList" >
        <li v-for="(item,key) in chatList" :key='key' :class=" item.isme ? 'mine magBox' : 'other magBox'" v-if='item.type=="msg"' >
          <div class="list">
            <div class="img"  :style="backGroundColor" v-if="!item.isme" ></div>
            <div class="message">
              <span>{{item.user}}</span>
              <div class="msgDiv">
                <p class="msgText">{{item.info}}</p>
              </div>
            </div>
            <div class="img"  v-if="item.isme" style="background:#FF5722;" ></div>
          </div>
        </li>
        <li class='msgtype' v-else>{{item.info}}</li>
      </ul>
    </div>
    <fe-group class="inputs">
      <fe-textarea :max="200" :placeholder="placeholder" v-model="msg.info" > 
      </fe-textarea>
      <fe-button type="primary" class="biubiu" mini @click.native="biubiu" :gradients="['#1D62F0', '#19D5FD']">发送</fe-button>
    </fe-group>
  </div>
</template>

<script>
import { Header, Textarea, Group, Button } from "feui";

export default {
  components: {
    [Header.name]: Header,
    [Textarea.name]: Textarea,
    [Group.name]: Group,
    [Button.name]: Button
  },
  created() {
    this.initWebSocket();
      Dialog.alert({
      // type:'html',
      title: '请输入群昵称',
      skin: 'ios',
      message: "<input value=''  id='ipts' />"
    })
    .then(() => {
      // on confirm
      // document.getElementById('ipts').value= 'id'+Math.random().toString(16).substr(3, 6)
      this.msg.user = document.getElementById('ipts').value?document.getElementById('ipts').value:'id'+Math.random().toString(32).substr(9, 12) ;

      this.msg.type='enter'
      this.msg.info= this.msg.user+'加入聊天'
      this.websocketsend(JSON.stringify(this.msg));
      this.msg.info= '';

      console.log("confirm");
    })
    .catch(() => {
      // on cancel
      console.log("cancel");
    });
  },
  data() {
    return {
      placeholder: "聊天咯",
      msg: {
        type: "msg",
        user: "",
        info: ""
      },
      // chatList: [{'user': "xiaoming", 'type':'msg','info': "测试信息"}],
      chatList: [],
      websock: null
    };
  },
  computed:{
    backGroundColor(){
      return 'background:#'+Math.random().toString(16).substr(3, 6)
    }
  },
  methods: {
    initWebSocket() {
      console.log("initWebSocket");
      const wsuri = "ws://172.30.5.37:8088/"; //ws地址
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      console.log("WebSocket连接成功");
      // this.websocketsend(JSON.stringify(this.msg));
    },
    websocketonerror(e) {
      //错误
      alert("Webscoket连接发生错误");
      console.log("WebSocket连接发生错误");
    },
    websocketsend(agentData) {
      //数据发送
      this.websock.send(agentData);
    },
    websocketclose(e) {
      //关闭
      console.log("connection closed (" + e.code + ")");
    },
    websocketonmessage(e) {
      //数据接收
      var mes = JSON.parse(e.data);
      this.showMessage(mes);
    },
    showMessage(obj) {
      obj.isme = obj.user == this.msg.user ? true : false;
      this.createChatNode(obj);
    },
    biubiu() {
      console.log(this.msg)
      this.msg.type='msg'

      this.websocketsend(JSON.stringify(this.msg));
      this.msg.info=''
    },
    createChatNode(obj) {
      this.chatList.push(obj);
      console.info(obj, this.chatList);
    }
  }
};
</script>

<style lang='less'>
#index {
  height: 100%;
}
.box {
  position: absolute;
  top: 46px;
  bottom: 120px;
  left: 0;
  right: 0;
  overflow-y: scroll;
}
.list{
  display:flex;
  .message{
    flex: 1;
    padding-left: 15px;
    span{
      display: block;
      font-size: 12px;
      color: #808080;
    }
  }
  .img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #1990fe;
    background: #000000;
  }
}
#chatList {
  .magBox {
    margin: 20px 12px;
    position: relative;
    .msgDiv {
      padding: 10px;
      background-color: #D5CED3;
      border-radius: 2px;
      display: inline-block;
      position: relative;
      max-width: 95%;
      min-height: 20px;
      border-radius: 5px;
    }
  }
  .other {
    .msgDiv:before {
      width: 0px;
      position: absolute;
      top: 5px;
      left: -10px;
      border-style: solid;
      border-color: transparent #D5CED3;
      border-width: 6px 10px 6px 0;
      content: "";
    }
  }
  .mine {
    text-align: right;
    .message{
      margin-right: 15px;
    }
    .msgDiv{
      background-color: #dcf6ff;
      color: #000000;
      position: relative;
      text-align: left;
      &:before {
        width: 0px;
        position: absolute;
        top: 5px;
        right: -10px;
        border-style: solid;
        border-color: transparent #dcf6ff;
        border-width: 6px 0px 6px 10px;
        content: "";
      }
    }
  }
  .msgText {
    word-break: break-all;
    word-wrap: break-word;
  }
}
.msgtype{
  text-align: center;
  font-size: 12px;
  margin: 10px 0;
  color: #676e6f;
}
.inputs {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
