module Results.Add exposing (render)

import Html exposing (Html, button, div, text, span, input, ul, li)
import Html.Attributes
import Html.Events
import Json.Decode as Json
--import Material.Button as Button
--import Material.Textfield as Textfield
--import Material.Typography as Typo
--import Material.Options as Options exposing (css)
import App.Model --exposing (Mdl)
import App.Msg
import Results.Model
import Races.Model
import Riders.Model exposing (Rider)


render : Races.Model.Race -> Results.Model.ResultAdd -> List Rider -> List Results.Model.Result -> Html App.Msg.Msg
render race resultAdd riders results =
    div []
        [ --heading ("Add result for " ++ race.name)
         div []
            [ --field 0 "Result" App.Msg.SetResultAddResult
              --, field 1 "Rider name" App.Msg.SetResultRiderName mdl
             selectRider riders race results
            ]
        --, addButton
        ]

{--
heading : String -> Html App.Msg.Msg
heading headingText =
    Options.styled
        Html.p
        [ Typo.display2 ]
        [ text headingText ]


field : Int -> String -> (String -> App.Msg.Msg) -> Html App.Msg.Msg
field index label msg =
    div []
        [ Textfield.render App.Msg.Mdl
            [ index ]
            mdl
            [ Textfield.label label
            , Textfield.floatingLabel
            , Textfield.text_
            , Textfield.onInput msg
            ]
        ]


addButton : Mdl -> Html App.Msg.Msg
addButton =
    Button.render App.Msg.Mdl
        [ 0 ]
        mdl
        [ Button.raised
        , Button.onClick (App.Msg.AddResult)
        ]
        [ text "Add" ]
--}


resultExists : List Results.Model.Result -> Races.Model.Race -> Riders.Model.Rider -> Bool
resultExists results race rider =
    List.length
        (List.filter
            (\result -> race.id == result.raceId && rider.id == result.riderId)
            results
        )
        == 1


selectRider : List Riders.Model.Rider -> Races.Model.Race -> List Results.Model.Result -> Html App.Msg.Msg
selectRider allRiders race results =
    div []
        [ Html.select
            [ onSelect App.Msg.ResultAddSetRiderId ]
            (List.map
                (\rider ->
                    (Html.option
                        [ (Html.Attributes.value (toString rider.id))
                          -- , ( Html.Attributes.disabled ( resultExists results race rider ) )
                        ]
                        [ text rider.name ]
                    )
                )
                --riders
                allRiders
            )
        ]


targetSelectedIndex : Json.Decoder Int
targetSelectedIndex =
    Json.at [ "target", "selectedIndex" ] Json.int


onSelect : (Int -> msg) -> Html.Attribute msg
onSelect msg =
    Html.Events.on "change" (Json.map msg targetSelectedIndex)
