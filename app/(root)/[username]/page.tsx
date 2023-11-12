import React from "react";

export default function Profile({ params }: { params: { username: string } }) {
  return <div>{params.username}</div>;
}
