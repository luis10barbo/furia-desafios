import { Component, ElementRef, ViewChild } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ChatService, Message } from '../../services/chat/chat.service';
import { MarkdownModule } from 'ngx-markdown';
import { HeaderComponent } from "../header/header.component";
import { uuidv4 } from "../../utils/uuid" 

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule, MarkdownModule, HeaderComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLInputElement>;

  chatForm = new FormGroup({
    query: new FormControl("", [Validators.required, Validators.minLength(4)]),
  })

  chat: Message[] = [
    {id: uuidv4(), message: "**Bem vindo ao ChatBot Fúria.** \n\n Vamos falar sobre algo relacionado à Fúria?", role: "assistant"}
  ]
  answering = false;

  constructor(private chatService: ChatService) {}

  async chatSubmit() {
    // TODO: Switch uuidv4 for crypto.uuidv4
    this.answering = true;
    const uuid = uuidv4();
    this.chat.push({id: uuidv4(), role: "user", message: this.chatForm.value.query!!});
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    
    (await this.chatService.queryChat(
      this.chatForm.value.query!!,
      this.chat
    )).subscribe((val) => {
      if (this.answering) {
        this.answering = false;
      }
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      
      let indexToUpdate = this.chat.findIndex(item => item.id === uuid);
      if (indexToUpdate === -1) {
        this.chat.push({role: "assistant", message: val, id: uuid})
      } else {
        const oldInfo = this.chat[indexToUpdate];
        this.chat[indexToUpdate] = {...oldInfo, message: oldInfo.message + val}
      }
    });
    this.chatForm.reset();
  }
}
