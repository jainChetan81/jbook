/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["res.imagekit.io", "doodleipsum.com", "res.cloudinary.com", "ik.imagekit.io"],
		minimumCacheTTL: 3600,
		disableStaticImages: true,
	},
};
