module Component.SubmitButton exposing (view)

import Html exposing (Html, button, text)
import Html.Attributes exposing (class, disabled, name, type_)
import Html.Attributes as Attributes
import Html.Events exposing (onClick)


type alias Config msg =
    { text : String
    , onClick : msg
    , isDisabled : Bool
    , name : Maybe String
    }


view : Config msg -> Html msg
view config =
    let
        baseAttributes =
            [ class "button is-primary"
            , type_ "submit"
            , onClick config.onClick
            , disabled config.isDisabled
            ]
        
        nameAttribute =
            case config.name of
                Just n ->
                    [ name n ]
                Nothing ->
                    []
    in
    button
        (baseAttributes ++ nameAttribute)
        [ text config.text ]