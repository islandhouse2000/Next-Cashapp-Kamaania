import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    await dbConnect();

    try {
        const users = await User.find({
            register: { $elemMatch: { phonenumber: { $ne: "none" } } },
        });

        const usersInfo = users.map(user => {
            const completeRegisters = user.register.filter((entry: any) => entry.phonenumber !== "none");
            return {
                firstname:user.firstname,
                lastname:user.lastname,
                _id: user._id,
                tag: user.tag,
                completeRegisters,
            };
        });

        return NextResponse.json({ ok: 'Fetch successful', data: usersInfo }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'An error occurred while fetching users' }, { status: 500 });
    }
};
