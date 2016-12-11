module Rider.View.Add exposing (render)

import Html exposing (Html, button, div, text, span, input, ul, li)
import Rider.Model exposing (Rider)
import App.Msg


type alias RiderAdd =
    { rider : Rider
    }


initial : RiderAdd
initial =
    { rider = (Rider 0 "Initial" (Just Rider.Model.Elite))
    }


render : Rider -> Html App.Msg.Msg
render rider =
    div []
        []
