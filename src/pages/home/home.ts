import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //variables
  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any[] = [];

  constructor(
    public navCtrl: NavController,
    private media: Media,
    private file: File,
    public platform: Platform
  ) { }

  //essentially ngInit
  ionViewWillEnter() {
    this.getAudioList();
  }

  //starts the audio recording
  startRecording(): void {
    this.recording = true;

    //give the audio clip a name
    const date = new Date();
    this.fileName = 'recording_' + date.getDate() + date.getMonth() + date.getFullYear()
      + date.getHours() + date.getMinutes() + date.getSeconds() + '.m4a';

    //different behavior for each OS
    if (this.platform.is('ios')) {
      //create the file path
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
    }
    else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
    }
    //create the file
    this.audio = this.media.create(this.filePath);

    //start the audio recording (audio is the media object)
    this.audio.startRecord();
  }


  //stop recording
  stopRecording(): void {
    this.audio.stopRecord();
    let data = { filename: this.fileName };
    this.audioList.push(data);
    //put in local storage
    localStorage.setItem('audiolist', JSON.stringify(this.audioList));
    this.recording = false;
    //get the list of new items (can also just push this one to the list)
    this.getAudioList();
  }


  //gets a list of the audio files that were recorded
  getAudioList() {
    if (localStorage.getItem('audioList')) {
      this.audioList = JSON.parse(localStorage.getItem('audioList'));
      //console.log(this.audioList);
    }
  }

  play(file, idx) {
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
    }
    else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
    }
    this.audio = this.media.create(this.filePath);
    this.audio.play();
    this.audio.setVolume(0.8);
  }
}
