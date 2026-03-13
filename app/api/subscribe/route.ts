import { Resend } from 'resend';

export async function POST(request: Request) {
    const { email } = await request.json();
    console.log(email);

    const resend = new Resend(process.env.RESEND_API_KEY);
    // 1.create an account
    const {error: createError} = await  resend.contacts.create({
        email: email
    });
    if (createError) {
        return Response.json({ error: createError.message }, { status: 500 });
    }

    // 2.add account to contact list
    const { error: addError } = await resend.contacts.segments.add({
        email: email,
        segmentId: '3a9ea3ad-cc70-4d88-b350-2399df652bcf',
    });
    if (addError) {
        return Response.json({ error: addError.message }, { status: 500 });
    }

    return Response.json({ data: 'OK' }, { status: 200 });
}