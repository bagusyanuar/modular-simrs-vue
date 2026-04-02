import type { Meta, StoryObj } from '@storybook/vue3';
import GButton from './GButton.vue';

const meta: Meta<typeof GButton> = {
  title: 'Components/Button (GButton)',
  component: GButton,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'The text displayed inside the button',
    },
    class: {
      control: 'text',
      description: 'Tailwind classes to customize the button styling',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'This is a modular button component that wraps Shadcn UI Button. It is globally used across Gen SIMRS apps.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GButton>;

/**
 * The standard default button
 */
export const Default: Story = {
  args: {
    text: 'Click Me',
    class: '',
  },
};

/**
 * A button with custom Tailwind classes applied
 */
export const CustomStyle: Story = {
  args: {
    text: 'Save Changes',
    class: 'bg-green-600 hover:bg-green-700 text-white',
  },
};

/**
 * A destructured variant button using custom classes to simulate destructive variant
 */
export const Destructive: Story = {
  args: {
    text: 'Delete Data',
    class: 'bg-red-600 hover:bg-red-700 text-white',
  },
};
