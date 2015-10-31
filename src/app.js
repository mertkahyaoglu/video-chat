import React, { Component } from 'react';
import Peer from 'peerjs';

export class App extends Component {
  constructor(props) {
    super(props);
    var id = parseInt(Math.random()*1e4,10).toString(16);
    this.state =  {
      hash: id,
      peer: new Peer(id, {key: '45ebf7pheel8fr'})
    };
  }

  componentDidMount() {
    navigator.getUserMedia = (
      navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia
    );

    this.state.peer.on('open', (id) => console.log('Peer ID: ' + id));
    this.state.peer.on('call', this.onReceiveCall.bind(this));

    var url = window.location.href;
    var match = url.match(/#(.+)/);
    if (match != null) {
      this.setState({caller:true});
      this.call(match[1]);
    }

    this.prepareSelfVideo();
  }

  getMedia(success, error) {
    navigator.getUserMedia({audio: true, video: true}, success, error);
  }

  onReceiveCall(call) {
    this.getMedia((stream) => {
      console.log("answering..");
      call.answer(stream)
    }, (err) => console.log(err));

    call.on('stream', (stream) => {
      var video = document.querySelector('video');
      video.src = window.URL.createObjectURL(stream);
    });
  }

  onReceiveStream(stream) {
    var video = document.querySelector('.video-call');
    video.src = window.URL.createObjectURL(stream);
  }

  prepareSelfVideo() {
    this.getMedia((stream) => {
        var video = document.querySelector('.video-self');
        video.src = window.URL.createObjectURL(stream);
      }, (err) => console.log(err));
  }

  call(id) {
    this.getMedia((stream) => {
        var call = this.state.peer.call(id, stream);
        console.log("calling..");
        call.on('stream', this.onReceiveStream);
      }, (err) => console.log(err)).bind(this);
  }

  componentWillUnmount() {
    this.state.peer.disconnect();
  }

  render() {
    return (
      <div className="container">
        <nav>
          Video Chat
        </nav>
        <div className="video-container">
          <video className="video-call" autoPlay></video>
          <video className="video-self" autoPlay></video>
          <div className="share">
            <a>Share - {"https://mertkahyaoglu.github.io/video-chat#"+this.state.hash}</a>
          </div>
        </div>
        <footer>
          Made by <a target="_blank" href="https://mertkahyaoglu.github.io">Mert Kahyaoğlu</a>
        </footer>
      </div>
    );
  }
}
