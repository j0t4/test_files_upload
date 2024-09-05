```
# Test V0

This project uses the following technologies:

- Next.js
- Tailwind CSS
- Radix UI
- Shadcn UI

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Project Structure

- **components**: Contains all the React components for the project.
    - **ui**: Contains UI components from the Shadcn UI library.
        - **checkbox.tsx**: Implements a checkbox component using Radix UI.
        - **toaster.tsx**: Implements a toaster notification system using Radix UI.
- **lib**: Contains utility functions.
- **hooks**: Contains custom React hooks.

## Styling

This project uses Tailwind CSS for styling. The configuration file is located at `tailwind.config.ts`.

## Aliases

The project uses the following aliases:

- `@/components`: Path to the `components` directory.
- `@/lib`: Path to the `lib` directory.
- `@/hooks`: Path to the `hooks` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
```