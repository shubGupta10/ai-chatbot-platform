# DevChat - Build Intelligent & Context aware
Chatbots

DevChat is a platform that enables users to create and deploy customized AI-powered chatbots. These chatbots can be integrated into websites, apps, and portfolios to enhance user interaction and provide valuable insights.

## Features

- **AI-Powered**: Create intelligent chatbots powered by Google Vertex AI.
- **Context-Aware**: Chatbots remember and respond based on the context provided by users.
- **Insights and Analytics**: Gain valuable data on chatbot interactions and user behavior.
- **Redis Caching**: Reduces API calls for improved performance and speed.
- **Secure and Scalable**: Authentication and user management powered by NextAuth.
- **Integration Links**: Easily generate and embed chatbot links into your platforms.

## Tech Stack

### Frontend
- **Next.js**: Ensures a fast and interactive user interface.
- **TypeScript**: Provides type safety and maintainable code.
- **Tailwind CSS**: Facilitates responsive and customizable design.
- **Shadcn**: Delivers a modern and elegant component library.

### Backend
- **Node.js**: Powers server-side operations.
- **TypeScript**: Ensures strong typing for reliable backend development.
- **LangChain**: Manages AI logic and conversation flow.
- **Google Vertex AI**: Provides advanced AI capabilities for chatbot intelligence.
- **Redis**: Implements caching for faster responses and reduced latency.
- **MongoDB**: Securely stores user data and chatbot configurations.
- **REST API**: Enables seamless communication between the frontend and backend.
- **NextAuth**: Handles secure and scalable authentication.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shubGupta10/ai-chatbot-platform
   cd devchat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   VERTEX_API_KEY=your_vertex_ai_api_key
   NEXT_PUBLIC_API_URL=your_rest_api_endpoint
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=your_nextauth_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## Usage

- **For Websites**: Integrate a chatbot to enhance user engagement and provide instant support.
- **For Apps**: Embed chatbots into your mobile or web applications for interactive user experiences.
- **For Portfolios**: Add a chatbot to your portfolio to answer visitor queries or share project details.

## Roadmap

- **Advanced Customization**: Add more options for UI and behavior customization.
- **Third-party Integrations**: Integrate with popular tools and platforms for enhanced functionality.
- **Multi-language Support**: Enable chatbots to interact in multiple languages.

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out:

- Portfolio: [Your Portfolio](https://shubgupta.vercel.app)
- Email: your-email@example.com
