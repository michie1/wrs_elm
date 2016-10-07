import Html exposing (Html, button, div, text)
import Html.App as Html
import Html.Events exposing (onClick)

main =
  Html.beginnerProgram
    { model = model
    , view = view
    , update = update
    }

-- MODEL


type alias Model = 
  { counter : Int,
    bla : String
  }



model : Model
model =
  Model 0 "foo"


-- UPDATE


type Msg
  = Increment
  | Decrement
  | Change


update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
        { model | counter = model.counter + 1 }

    Decrement ->
        { model | counter = model.counter - 1 }

    Change -> 
        { model | bla = toString model.counter }

-- VIEW


view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (toString model.counter) ]
    , button [ onClick Increment ] [ text "+" ]
    , div [] 
      [ button [ onClick Change ] [ text model.bla ]
      ]
    ]
