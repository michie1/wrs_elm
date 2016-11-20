module Races.Add exposing (render)

import Html exposing (Html, p, form, button, div, text, span, input, ul, li, a, i, h2, label)
import Html.Attributes exposing (value, autofocus, class, name, type_, id, for, checked, disabled)
import Html.Events exposing (onClick, onInput)
--import Material.Textfield as Textfield
--import Material.Options as Options exposing (css)
--import App.Model exposing (Mdl)
import App.Msg
import Races.Model exposing (Race)
import App.Msg
--import Date


render : Races.Model.Add -> Html App.Msg.Msg
render raceAdd =
    let
        name =
            raceAdd.name

        dateString =
            raceAdd.dateString

        submitDisabled =
            name == ""
    in
        div []
            [ h2 [] [ text "Add Race" ]
            , div []
                [ div [ class "row" ]
                    [ div [ class "input-field col s6" ]
                        [ input [ id "name", type_ "text", onInput App.Msg.SetRaceName ] []
                        , label [ for "name" ] [ text ("Name " ++ name) ]
                        ]
                    ]
                , div [ class "row" ]
                    [ div [ class "input-field col s6" ]
                        [ input
                            [ id "date"
                            , type_ "text"
                            , value dateString
                            , onInput App.Msg.SetRaceDate
                            ]
                            []
                        , label [ for "date" ] [ text "Date" ]
                        ]
                    ]
                , div [ class "row" ]
                    [ button
                        [ class "waves-effect waves-light btn"
                        , onClick App.Msg.SetRaceAddYesterday
                        ]
                        [ text "Yesterday" ]
                    , button
                        [ class "waves-effect waves-light btn"
                        , onClick App.Msg.SetRaceAddToday
                        ]
                        [ text "Today" ]
                    ]
                , div [ class "row" ] [ categoryButtons ]
                , div [ class "row" ]
                    [ button
                        [ class "waves-effect waves-light btn"
                        , type_ "submit"
                        , onClick App.Msg.AddRace
                        , Html.Attributes.name "action"
                        , disabled submitDisabled
                        ]
                        [ text "Add Race"
                        , i [ class "material-icons right" ] [ text "send" ]
                        ]
                    ]
                ]
            {-- , div []
                [ Textfield.render App.Msg.Mdl
                    [ 2 ]
                    mdl
                    [ Textfield.label "Date (MM-DD-YYYY)"
                    , Textfield.value dateString
                    , Textfield.floatingLabel
                    , Textfield.text_
                    , Textfield.onInput App.Msg.SetRaceDate
                    , case Date.fromString dateString of
                        Ok date ->
                            Options.nop

                        Err errMsg ->
                            Textfield.error <| "Invalid date"
                    ]
                ]
            --}
            ]

categoryButtonCheck : String -> String -> Bool -> Html App.Msg.Msg
categoryButtonCheck categoryName categoryText isChecked =
    p []
        [ input [ checked isChecked, name "category", type_ "radio", id categoryName ] []
        , label [ for categoryName ] [ text categoryText ]
        ]

categoryButton : String -> String -> Html App.Msg.Msg
categoryButton categoryName categoryText =
    categoryButtonCheck categoryName categoryText False

categoryButtons : Html App.Msg.Msg
categoryButtons =
    div []
        [ categoryButtonCheck "classic" "Klassieker" True
        , categoryButton "criterum" "Criterium"
        , categoryButton "regiocross" "Regiocross"
        , categoryButton "other" "Other"
        ]
