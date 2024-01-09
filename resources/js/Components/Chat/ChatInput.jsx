// import Reac
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ChatInput({receiverId}) {

    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
        receiver_id: receiverId,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('chat.store'));
        setData('message', '');
    };

    return (
        <div className="bg-white">
            <form onSubmit={submit}>
                <InputError message={errors.message} className="bg-gray-200 p-1" />
                <div className="flex items-center bg-gray-200 p-4">
                    <textarea
                        id="message"
                        name="message"
                        className="w-4/5 p-2 ml-10 border border-gray-300 rounded-lg resize-none focus:outline-none"
                        placeholder="Write a message..."
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault(); // Prevent the Enter key from adding a new line
                              submit(e); // Call your submit function here
                            }
                          }}
                        required
                    ></textarea>
                     <TextInput
                        id="receiver_id"
                        name="receiver_id"
                        value={data.receiver_id}
                        className="mt-1 block w-full"
                        type="hidden"
                        onChange={(e) => setData('receiver_id', e.target.value)}
                    />
                   
                    <PrimaryButton className="ml-4 bg-blue-500" disabled={processing}>
                        Send
                    </PrimaryButton>
                   
                </div>
            </form>
        </div>
    )
}
