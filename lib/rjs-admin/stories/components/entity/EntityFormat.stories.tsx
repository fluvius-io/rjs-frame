import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { EntityFormat } from "../../../src/components/entity/EntityFormat";
import "../../../src/lib/api";

const meta: Meta<typeof EntityFormat> = {
  title: "Entity/EntityFormat",
  component: EntityFormat,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "EntityFormat fetches and displays entity data from an API endpoint with customizable rendering options.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    _id: {
      control: "text",
      description: "The unique identifier of the entity to fetch",
    },
    apiName: {
      control: "text",
      description: "The API endpoint name to fetch from",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    onError: {
      action: "error",
      description: "Callback function called when an error occurs",
    },
    onLoad: {
      action: "loaded",
      description: "Callback function called when data is loaded",
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const BasicUser: Story = {
  args: {
    _id: "42a7f9a5-7e12-4384-a97d-abe9271797dd",
    apiName: "idm:user",
  },
};

export const CustomRender: Story = {
  args: {
    _id: "42a7f9a5-7e12-4384-a97d-abe9271797dd",
    apiName: "idm:user",
    renderEntity: (user: any) => (
      <div style={{ padding: 24, background: "#f9f9f9", borderRadius: 8 }}>
        <h3>
          {user.name__given} {user.name__family}
        </h3>
        <p>Email: {user.verified_email}</p>
        <p>Role: {user.role}</p>
      </div>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    _id: "42a7f9a5-7e12-4384-a97d-abe9271797dd",
    apiName: "idm:user",
    className: "custom-entity-style",
  },
};
