import { signJwt } from "../util/jwt";
import env from "../util/validateEnv";

interface IssueResearcherAccessTokenParams {
    researcherId: string;
    role?: string;
}

export function issueResearcherAccessToken({ researcherId, role }: IssueResearcherAccessTokenParams) {
    const accessToken = signJwt(
        {
            researcherId,
            userRole: role,
        },
        "ACCESS_TOKEN_PRIVATE_KEY",
        {
            expiresIn: env.ACCESS_TOKEN_TTL,
        }
    );

    return accessToken;
}

interface IssueResearcherRefreshTokenParams {
    researcherId: string;
}

export function issueResearcherRefreshToken({ researcherId }: IssueResearcherRefreshTokenParams) {
    const refreshToken = signJwt(
        {
            researcherId,
        },
        "REFRESH_TOKEN_PRIVATE_KEY",
        {
            expiresIn: env.REFRESH_TOKEN_TTL,
        }
    );

    return refreshToken;
}

interface IssueParticipantAccessTokenParams {
    participantId: string;
}

export function issueParticipantAccessToken({ participantId }: IssueParticipantAccessTokenParams) {
    const participantToken = signJwt(
        {
            participantId,
        },
        "ACCESS_TOKEN_PRIVATE_KEY",
        {
            expiresIn: env.PARTICIPANT_TOKEN_TTL,
        }
    );

    return participantToken;
}

interface IssueSecondSourceAccessTokenParams {
    participantId: string;
    secondSourceId: string;
}

export function issueSecondSourceAccessToken({ participantId, secondSourceId }: IssueSecondSourceAccessTokenParams) {
    const secondSourceToken = signJwt(
        {
            participantId,
            secondSourceId,
        },
        "ACCESS_TOKEN_PRIVATE_KEY",
        {
            expiresIn: env.PARTICIPANT_TOKEN_TTL,
        }
    );

    return secondSourceToken;
}
