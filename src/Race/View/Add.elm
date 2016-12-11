module Race.View.Add exposing (render)

import Html exposing (Html, p, form, button, div, text, span, input, ul, li, a, i, h2, label)
import Html.Attributes exposing (autofocus, value, autofocus, class, name, type_, id, for, checked, disabled)
import Html.Events exposing (onClick, onInput)
import App.Msg
import Race.Model exposing (Race)
import App.Msg


render : Race.Model.Add -> Html App.Msg.Msg
render raceAdd =
    let
        name =
            raceAdd.name

        dateString =
            case raceAdd.dateString of
                Just dateString ->
                    dateString

                Nothing ->
                    ""

        submitDisabled =
            name == ""
    in
        div []
            [ h2 [] [ text "Add Race" ]
            , div []
                [ div [ class "row" ]
                    [ div [ class "input-field col s6" ]
                        [ input
                            [ id "name"
                            , type_ "text"
                            , onInput App.Msg.RaceName
                            , autofocus True
                            ]
                            []
                        , label [ for "name" ] [ text ("Name " ++ name) ]
                        ]
                    ]
                , div [ class "row" ]
                    [ div [ class "input-field col s6" ]
                        [ input
                            [ id "date"
                            , type_ "text"
                            , value dateString
                            , onInput App.Msg.RaceDate
                            ]
                            []
                        , label [ for "date" ] [ text "Date" ]
                        ]
                    ]
                , div [ class "row" ]
                    [ button
                        [ class "waves-effect waves-light btn"
                        , onClick App.Msg.RaceAddYesterday
                        ]
                        [ text "Yesterday" ]
                    , button
                        [ class "waves-effect waves-light btn"
                        , onClick App.Msg.RaceAddToday
                        ]
                        [ text "Today" ]
                    ]
                , div [ class "row" ] [ categoryButtons ]
                , div [ class "row" ]
                    [ button
                        [ class "waves-effect waves-light btn"
                        , type_ "submit"
                        , onClick App.Msg.RaceAdd
                        , Html.Attributes.name "action"
                        , disabled submitDisabled
                        ]
                        [ text "Add Race"
                        , i [ class "material-icons right" ] [ text "send" ]
                        ]
                    ]
                ]
            ]


categoryButtonCheck : String -> String -> Race.Model.Category -> Bool -> Html App.Msg.Msg
categoryButtonCheck categoryName categoryText category isChecked =
    p []
        [ input [ checked isChecked, name "category", type_ "radio", id categoryName, onClick (App.Msg.RaceAddCategory category) ] []
        , label [ for categoryName ] [ text categoryText ]
        ]


categoryButton : String -> String -> Race.Model.Category -> Html App.Msg.Msg
categoryButton categoryName categoryText category =
    categoryButtonCheck categoryName categoryText category False


categoryButtons : Html App.Msg.Msg
categoryButtons =
    div []
        [ categoryButtonCheck "classic" "Klassieker" Race.Model.Classic True
        , categoryButton "criterum" "Criterium" Race.Model.Criterium
        , categoryButton "regiocross" "Regiocross" Race.Model.Regiocross
        , categoryButton "other" "Other" Race.Model.Other
        ]
