module Component.TextInput exposing (Config, view)

import Html exposing (Html, div, i, input, label, p, span, text)
import Html.Attributes exposing (autofocus, class, for, id, type_, value)
import Html.Events exposing (onInput)


type alias Config msg =
    { id : String
    , label : String
    , value : String
    , onInput : String -> msg
    , autofocus : Bool
    , icon : Maybe String
    , isHorizontal : Bool
    }


view : Config msg -> Html msg
view config =
    let
        inputElement =
            input
                [ id config.id
                , class "input"
                , type_ "text"
                , onInput config.onInput
                , autofocus config.autofocus
                , value config.value
                ]
                []

        inputWithIcon =
            case config.icon of
                Just iconClass ->
                    p [ class "control has-icons-left" ]
                        [ inputElement
                        , span [ class "icon is-small is-left" ] 
                            [ i [ class iconClass ] [] ]
                        ]
                Nothing ->
                    div [ class "control" ]
                        [ inputElement ]

        labelElement =
            label [ class "label", for config.id ] [ text config.label ]

        fieldContent =
            if config.isHorizontal then
                div [ class "field is-horizontal" ]
                    [ div [ class "field-label" ]
                        [ labelElement ]
                    , div [ class "field-body" ]
                        [ div [ class "field" ]
                            [ inputWithIcon ]
                        ]
                    ]
            else
                div [ class "field" ]
                    [ labelElement
                    , inputWithIcon
                    ]
    in
    fieldContent