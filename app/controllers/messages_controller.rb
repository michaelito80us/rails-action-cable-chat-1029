class MessagesController < ApplicationController
  def create
    # we need the chatroom
    @chatroom = Chatroom.find(params[:chatroom_id])
    # we need the user
    @user = current_user
    # we need the content
    @message = Message.new(message_params)
    @message.user = @user
    @message.chatroom = @chatroom
    if @message.save
      # broadcast the message
      ChatroomChannel.broadcast_to(
        @chatroom,
        render_to_string(partial: "message", locals: {message: @message})
      )
      head :ok

    else
      render "chatrooms/show", status: :unprocessable_entity
    end
  end

  private

  def message_params
    params.require(:message).permit(:content)
  end
end
