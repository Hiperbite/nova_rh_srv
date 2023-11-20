
import { Request, Response } from "express";
import { get } from "lodash";
import { CreateSessionInput } from "../../application/schema";

import {
    findSessionById,
    lockAccessToken,
    signAccessToken,
    signRefreshToken,
} from "../../service/auth.service";

import { verifyJwt } from "../../application/jwt";
import { User, Employee } from "../../models/index";

export async function createSessionHandler(
    req: Request<{}, {}, CreateSessionInput>,
    res: Response
) {
    const message = "Invalid email or password";
    let status = 200;
    const { email, password } = req.body;

    const user: User | null | any = await User/*.scope('auth')*/.findOne({ where: { email } });

    if (!user) {

        return res.status(401).send(message);
    }

    if (!user.verified) {
        return res.send("Please verify your email");
    }

    const isValid = await user.passwordCompare(password);

    if (!isValid) {
        return res.status(403).send(message);
    }

    const employeeId = user.employeeId;

    // sign a access token
    const accessToken = signAccessToken(user, employeeId);

    // sign a refresh token
    const refreshToken = await signRefreshToken({ userId: String(user.id) });

    // send the tokens
    return res.status(status).send({ accessToken, refreshToken });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {

    const refreshToken = get(req, "headers.x-refresh");

    const decoded = verifyJwt<{ session: string }>(
        String(refreshToken),
        "refreshTokenPrivateKey"
    );

    if (!decoded) {
        return res.status(401).send("Could not refresh access token");
    }

    const session = await findSessionById(decoded.session);

    if (!session || !session.valid) {
        return res.status(401).send("Could not refresh access token");
    }

    const user = await User.findByPk(String('session.userId'));

    if (!user) {
        return res.status(401).send("Could not refresh access token");
    }

    const accessToken = signAccessToken(user);

    return res.send({ accessToken });
}

export async function lockAccessTokenHandler(req: Request, res: Response) {

    const token = get(req, "headers.authorization");

    const decoded: any = verifyJwt<{ session: string }>(
        String(token?.split(" ")[1]),
        "accessTokenPublicKey"
    );

    const user: User | null | any = await User.findOne({ where: { id: decoded?.id } });

    if (!(decoded && user)) {
        return res.status(401).send("Could not lock access token");
    }

    user.role = "ROLE_LOCKED";
    
    const accessToken = signAccessToken(user, decoded?.employeeId);

    return res.send({ accessToken });
}