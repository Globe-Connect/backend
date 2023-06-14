import jwt from 'jsonwebtoken';

// Utility function to generate a JWT
export const generateToken = (payload: any): string => {
    // Set the token expiration time (e.g., 1 day)
    const expiresIn = '1d';

    // Generate the JWT using the payload, a secret key, and the expiration time
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });

    return token;
};

// Utility function to verify a JWT and extract the payload
export const verifyToken = (token: string): any => {
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Return the decoded payload
        return decoded;
    } catch (error) {
        // If the token is invalid or expired, throw an error
        throw new Error('Invalid or expired token');
    }
};
