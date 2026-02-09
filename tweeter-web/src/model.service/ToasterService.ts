export interface ToastMessage {
    id: string;
    title: string;
    text: string;
    bootstrapClasses: string;
    expirationMillisecond: number;
  }
  
  export class ToasterService {
    public getExpiredToasts(messageList: ToastMessage[]): string[] {
      const now = Date.now();
      const expiredIds: string[] = [];
  
      for (let toast of messageList) {
        if (
          toast.expirationMillisecond > 0 &&
          toast.expirationMillisecond < now
        ) {
          expiredIds.push(toast.id);
        }
      }
  
      return expiredIds;
    }
  }