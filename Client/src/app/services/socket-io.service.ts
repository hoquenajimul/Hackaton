import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketIoService {
    connection: any;

    constructor() {
        this.connection = io('http://localhost:4000');
    }
}