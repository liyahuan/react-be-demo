import type { Meta, StoryObj } from '@storybook/react';

import {Header}  from '../../components/header';

const meta = {
  title: 'UI Components/Header',
  component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
    
  },
  args: {
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof Header>;

export const Er: Story = {
  args: {
    backgroundColor:'yellowgreen',
    heading: 'Engagement Rings',
    subtext: 'Whether natural or lab grown, each of our diamonds is responsibly sourced and selected for its brilliant sparkle.'
  },
};

export const LoggedOut: Story = {};
