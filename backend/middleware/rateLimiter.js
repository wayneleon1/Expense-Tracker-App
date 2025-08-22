import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // Here we are using the hardcode identify but in real world application we can use something like user_id,api or token
    const { success } = await rateLimit.limit("my-rate-limit");
    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    }
    next();
  } catch (error) {
    console.log("Rate limit Error", error);
    next(error);
  }
};

export default rateLimiter;
