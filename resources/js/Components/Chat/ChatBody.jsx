
export default function ChatMessages({messages, receiverId}) {
    const formatedMessageDateTime = (date_time) => {
        const messageDate = new Date(date_time);

        // Get the current date
        const currentDate = new Date();
      
        // Check if the message date is today
        if (
          messageDate.getDate() === currentDate.getDate() &&
          messageDate.getMonth() === currentDate.getMonth() &&
          messageDate.getFullYear() === currentDate.getFullYear()
        ) {
          // Format as HH:mm AM/PM
          const formattedTime = messageDate.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          return formattedTime;
        } else {
          // Format as Mon or Tues HH:mm AM/PM
          const formattedDate = messageDate.toLocaleString('en-US', {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          return formattedDate;
        }
    }
    const messageView = (message) => {
        // console.log(message?.created_at);
        if (message.receiver_id !== receiverId) {
            return (
                <div className="receive-chat relative flex justify-start">
                    <div className="mb-2 max-w-[80%] rounded bg-violet-400 px-5 py-2 text-sm text-white">
                        <i className="fa fa-caret-up absolute -top-2 text-violet-400"></i>
                        <p>{message.message}
                        </p>
                        <span className="text-xs text-right block mt-2">{formatedMessageDateTime(message?.created_at)}</span>
                    </div>
                </div>
            )
        }
        if (message.receiver_id === receiverId) {
            return (
                <div className="send-chat relative flex justify-end">
                    <div className="mb-2 max-w-[80%] rounded bg-violet-200 px-5 py-2 text-sm text-slate-500">
                        <p style={{ columnCount: 1, columnGap: '20px' }}>{message.message}</p>
                        <span className="text-xs text-right block mt-2">{formatedMessageDateTime(message?.created_at)}</span>
                    </div>
                </div>
            )
        } 
    }

    return (
        <>
        {
            messages.map((message, index) => (
                <div key={index}>
                    {messageView(message)}
                </div>
            ))
        }
        </>
    )
}
