import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  chatForm = new FormGroup({
    query: new FormControl("", [Validators.required, Validators.minLength(4)]),
  })

  chat: {message:string, isChatBot: boolean, id: string}[] = []

  constructor(private chatService: ChatService) {}

  async chatSubmit() {
    const uuid = crypto.randomUUID();
    (await this.chatService.queryChat(
      this.chatForm.value.query!!
    )).subscribe((val) => {
      let indexToUpdate = this.chat.findIndex(item => item.id === uuid);
      if (indexToUpdate === -1) {
        this.chat.push({isChatBot: true, message: val, id: uuid})
      } else {
        const oldInfo = this.chat[indexToUpdate];
        this.chat[indexToUpdate] = {...oldInfo, message: oldInfo.message + val}
      }
    });
  }
}
