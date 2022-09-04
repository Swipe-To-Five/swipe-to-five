const BadRequest = (message: string) => ({
  message: message ?? 'Bad Request',
  code: 400,
});

const Unauthorized = (message: string) => ({
  message: message ?? 'Unauthorized',
  code: 401,
});

const NotFound = (message: string) => ({
  message: message ?? 'Not Found',
  code: 404,
});

const InternalServerError = (message: string) => ({
  message: message ?? 'Internal Server Error',
  code: 500,
});

const BadGateway = (message: string) => ({
  message: message ?? 'Bad Gateway',
  code: 502,
});

export const checkForException = (status: number) => {
  switch (status) {
    case 400: {
      return BadRequest;
    }
    case 401: {
      return Unauthorized;
    }
    case 404: {
      return NotFound;
    }
    case 500: {
      return InternalServerError;
    }
    case 502: {
      return BadGateway;
    }
  }
};

