FROM node:20-slim AS base

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build

# Set up the production environment
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Set permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy build output and static files
RUN cp -r .next/static .next/standalone/.next/static
RUN chown -R nextjs:nodejs .next/standalone

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", ".next/standalone/server.js"] 