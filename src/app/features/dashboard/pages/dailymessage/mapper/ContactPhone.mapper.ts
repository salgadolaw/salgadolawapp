import { ContactPhone, PhoneContact } from '../interfaces/dailyMessage';



export class ContactMapper {

  static mapContactItems(items: ContactPhone): PhoneContact {
    return {
      id: items.id.toString(),
      name: items.name
    }

  }


  static mapContactItemsArray(items: ContactPhone[]): PhoneContact[] {
    return items.map(this.mapContactItems)
  }

}


