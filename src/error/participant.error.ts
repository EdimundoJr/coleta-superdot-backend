class ParticipantError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class EmailAlreadyRegisteredError extends ParticipantError { }

export class ObjectNotExists extends ParticipantError { }

export class FormAlreadyFinished extends ParticipantError { }

export class SampleFullError extends ParticipantError { }



