export default function ChatUserInfoHeader({receiverInfo}) {
    return (
        <div className="user-info-header bg-white px-5 py-3">
            <div className="flex justify-between">
                <div className="flex items-center">
                    {
                        receiverInfo?.avatar !== undefined ?
                            <img src={receiverInfo?.avatar} width="40" />
                            :
                            <i className="fa fa-user-circle text-gray-300 text-5xl"></i>
                    }
                    <h3 className="text-md pl-4 text-gray-400">{receiverInfo?.name}</h3>
                </div>
                <div>
                    <i className="fa fa-message text-violet-300"></i>
                    <i className="fa fa-video ml-3 text-gray-200"></i>
                    <i className="fa fa-phone ml-3 text-gray-200"></i>
                </div>
            </div>
        </div>
    )
}
