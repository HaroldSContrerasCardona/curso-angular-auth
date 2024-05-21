import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { TodoDialogComponent } from '@boards/components/todo-dialog/todo-dialog.component';

import { CardService } from '@services/card.service';
import { BoardsService } from '@services/boards.service';
import { ActivatedRoute } from '@angular/router';
import { Board } from '@models/board.model';
import { Card } from '@models/card.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styles: [
    `
      .cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class BoardComponent implements OnInit {


  board: Board | null = null;

  // columns: Column[] = [
  //   {
  //     title: 'ToDo',
  //     todos: [
  //       {
  //         id: '1',
  //         title: 'Make dishes',
  //       },
  //       {
  //         id: '2',
  //         title: 'Buy a unicorn',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Doing',
  //     todos: [
  //       {
  //         id: '3',
  //         title: 'Watch Angular Path in Platzi',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Done',
  //     todos: [
  //       {
  //         id: '4',
  //         title: 'Play video games',
  //       },
  //     ],
  //   },
  // ];

  // todos: ToDo[] = [];
  // doing: ToDo[] = [];
  // done: ToDo[] = [];

  constructor(private dialog: Dialog,
    private route: ActivatedRoute,
    private boardsService: BoardsService,
    private cardsService: CardService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('boardId');
      if (id) {
        this.getBoard(id);
      }
    });
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    const position = this.boardsService.getPosition(event.container.data,event.currentIndex);
    const card = event.container.data[event.currentIndex];
    const listId = event.container.id;
    this.updateCard(card, position, listId);
  }

  addColumn() {
    // this.columns.push({
    //   title: 'New Column',
    //   todos: [],
    // });
  }

  openDialog(card: Card) {
    console.log(card)
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      minWidth: '300px',
      maxWidth: '50%',
      data: {
        card: card,
      },
    });
    dialogRef.closed.subscribe((output) => {
      console.log(output);
    });
  }

  private getBoard(id: string) {
    this.boardsService.getBoard(id)
    .subscribe(board => {
      this.board = board;
    });
  }

  private updateCard(card: Card, position: number, listId:string | number) {
    this.cardsService.update(card.id, {position, listId})
    .subscribe((cardUpdate) => {
      console.log(cardUpdate)
    });
  }
}
