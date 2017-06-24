import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'appendPipe',
    pure: true // optional, default is true false means maintain state
})

//http://voidcanvas.com/angular-2-pipes-filters/

/**
 * this pipe takes two arguments,
 *  string to append(position 0)
 *  number of times to append (position 1)
 *  if neither is supplied, it default to '...'
 *
 * USAGE:
 *
 * {message | appendPipe:3:'$'}
 * {message | appendPipe}
 */
export class AppendPipe implements PipeTransform {
    transform(inputString: string, ...args: any[]): any {
        if (args.length == 0) {
            return inputString + ' ...';
        }
        let appValue = '.';
        if (args.length == 2) {
            appValue = args[1];
        }

        let t = inputString;
        for (var k = 0; k < args[0]; k++) {
            t = t + appValue;
        }

        return t;
    }
}




/*
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pomodoroFormattedTime'
})
export default class FormattedTimePipe implements PipeTransform {
  transform(totalMinutes: number): string {
    let minutes: number = totalMinutes % 60;
    let hours: number = Math.floor(totalMinutes / 60);
    return `${hours}h:${minutes}m`;
  }
}
*/