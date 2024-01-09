import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function InviteFriends({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        console.log(e);

        post(route('chat.invite.friend'));
    };

    return (
       <>
            {/* {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>} */}
            <div className='px-5'>
                <p  className="w-5/6 ml-8 pb-2 text-gray-400">Enter the email of the people you want to invite as comma separated list. Hit enter or Invite Friend to send invite</p>
                <form onSubmit={submit}>
                <textarea
                        id="message"
                        name="message"
                        className="w-5/6 ml-8 border border-gray-300 rounded-lg resize-none focus:outline-none"
                        placeholder="example@email.com, johndoe@email.com"
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
                    <InputError message={errors.email} className="mt-2" />

                    <div className="flex items-center justify-center mt-4">
                        <PrimaryButton className="ml-4" disabled={processing}>
                            Invite Friend
                        </PrimaryButton>
                    </div>
                </form>
            </div>
       </>
    );
}
