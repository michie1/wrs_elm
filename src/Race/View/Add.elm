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

        {--
        dateString =
            case raceAdd.dateString of
                Just dateString ->
                    dateString

                Nothing ->
                    ""
        --}

        dateString = raceAdd.dateString

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
                            , value name
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
                , div [ class "row" ] [ categoryButtons raceAdd.category ]
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


categoryButtonCheck : String -> String -> Race.Model.Category -> Race.Model.Category -> Html App.Msg.Msg
categoryButtonCheck categoryName categoryText categoryModel current =
    let 
        isChecked = categoryModel == current 
    in
        p []
            [ input [ checked isChecked, name "category", type_ "radio", id categoryName, onClick (App.Msg.RaceAddCategory categoryModel) ] []
            , label [ for categoryName ] [ text categoryText ]
            ]

categoryButtons : Race.Model.Category -> Html App.Msg.Msg
categoryButtons current =
    div []
        [ categoryButtonCheck "classic" "Klassieker" Race.Model.Classic current
        , categoryButtonCheck "criterum" "Criterium" Race.Model.Criterium current
        , categoryButtonCheck "regiocross" "Regiocross" Race.Model.Regiocross current
        , categoryButtonCheck "other" "Other" Race.Model.Other current
        ]
